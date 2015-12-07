var chart_data_res;

var chart_opts;

var current_chart_data;

var get_initals = function(name){
  if (is_chinese()){
    if (!chart_data_res)
      chart_data_res = chart_data();
    var this_data = jQuery.grep(chart_data_res, function(item) {
                      return item["Name Eng"] == name;
                    });
    if (this_data.length > 0)
      return this_data[0]["Name CN"];
    return name;
  }

  var res = '';
  jQuery.each(name.split(' '), function(index, splitted) {
      if (splitted[0])
        res += splitted[0];
  });
  return res;
};

var get_focus = function (item){
  var i = 0;
  var focuses = ["Education", "Environment", "Healthcare", "Social Welfare", "Disaster Relief", "Culture"];
  jQuery.each(focuses, function(index, focus) {     
    if (item[focus] > 0)
      i++;
  });
  return i;
}

var get_industry_color = function (industry){
	var def_colors = [['Manufacturing', '#368DB9'], ['Real Estate', '#A51C30'], ['Energy', '#FAAE53'], ['Consumer', '#52854C'], ['Tech/IT','#293352'], 
                      ['Finance', '#48c4b7'], ['Education', '#861657'], ['Healthcare', '#CED665'], ['Transportation', '#8C8179'], ['Other', '#80475E']];
    var res = $.grep(def_colors, function(n){
			   	  return n[0] == industry;
			  });    	        
	if (res.length > 0)
		return res[0][1];
	var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;			   
}

var get_generosity_data = function (){
	if (!chart_data_res)
		chart_data_res = chart_data();
	var res = [];
	var filtered_data = $.grep(chart_data_res, function(n){
					    	return parseFloat(n['Generosity']);
					 	});
	var industries = $.map(filtered_data, function(n,i){
	   return n['Industry'];
	});
	industries = jQuery.unique(industries);
	$.each(industries, function (index, industry){
		var fetched_industrial = $.grep(filtered_data, function(n){
								   return n['Industry'] == industry;
								 });
		fetched_industrial = $.map(fetched_industrial, function(n,i){
							   return { x: n['Total Amount (million Yuan)'], y: parseFloat(n['Generosity']), z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
							   			full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
							 });
		res.push({
			name: trsl(industry),
			color: get_industry_color(industry),
	        data: fetched_industrial
		});
	});

	chart_opts = {
		xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m'
            }
        },
		yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Generosity')
            },
            labels: {
                format: '{value}%'
            },
            maxPadding: 0.2
        },

	}

	return res;
};

var get_focus_data = function (){
	if (!chart_data_res)
		chart_data_res = chart_data();
	var res = [];
	var industries = $.map(chart_data_res, function(n,i){
	   return n['Industry'];
	});
	industries = jQuery.unique(industries);
	$.each(industries, function (index, industry){
		var fetched_industrial = $.grep(chart_data_res, function(n){
								   return n['Industry'] == industry;
								 });
		fetched_industrial = $.map(fetched_industrial, function(n,i){
							   return { x: n['Total Amount (million Yuan)'], y:  get_focus(n), z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
							   			full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
							 });
		res.push({
			name: trsl(industry),
			color: get_industry_color(industry),
	        data: fetched_industrial
		});
	});

	chart_opts = {
		xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m'
            }
        },
		yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Philanthropic Causes')
            },
            labels: {
                format: '{value}%'
            },
            maxPadding: 0.2
        },

	}

	return res;
};

var init_charts = function (){
    var data = get_generosity_data();
	$('#series_chart_div').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1
        },

        legend: {
            enabled: true
        },
        exporting: { 
        	enabled: false 
        },
        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h4>{point.full_name}</h4></th></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: data,


        xAxis: chart_opts.xAxis,

        yAxis: chart_opts.yAxis

    });
    current_chart_data = data;
};

function match_by_id(new_data_item, old_data){
    var res = null;
    var ind = null;
    var series_index = null;
    $.each(old_data, function (index, old_data_list){
        $.each(old_data_list.data, function (i, data){
            if (data.id == new_data_item.id){
                ind = i;
                res = new_data_item;
                series_index = index;
            }
        });
    });
    return {res: res, ind: ind, series_index: series_index};
}

function update_chart_point(data, chart){
    chart.get(data.res.id).update(data.res, false);
}

function remove_chart_point(data, chart){
    chart.get(data.id).remove(false);
}

function add_chart_point(data_list, chart, data){
    var serie = $.grep(chart.series, function (item){
        return item.name == data_list.name;
    });
    if (serie.length > 0){
        serie[0].addPoint(data, false);
    } else {
        chart.addSeries({
            name: trsl(data_list.name),
            color: get_industry_color(data_list.name),
            data: [data]
        }, false);
    }
}

function diff_chart_data(new_data){
	var chart = $('#series_chart_div').highcharts();
	if (!current_chart_data)
		current_chart_data = new_data;
	var existing;

    $.each(current_chart_data, function (index, current_data_list){
        $.each(current_data_list.data, function (i, data){
            var matched = match_by_id(data, new_data);
            if (!matched.res){
                remove_chart_point(data, chart);
            }
        });
    }); 

	$.each(new_data, function (index, new_data_list){
		$.each(new_data_list.data, function (i, data){
			var matched = match_by_id(data, current_chart_data);
            if (matched.res){
                update_chart_point(matched, chart);
            } else {
                add_chart_point(new_data_list, chart, data);
            }
		});
	});	
    chart.redraw();

    var series_to_remove = [];
    $.each(chart.series, function (index, serie){
        if (!serie.points || serie.points.length <= 0){
            series_to_remove.push(serie.name);
        }
    }); 
    $.each(series_to_remove, function (index, serie_index){
        var serie = $.grep(chart.series, function (item){
            return item.name == serie_index;
        });
        if (serie.length > 0){
            serie[0].remove();
        }
    }); 

    /// UPDATE AXISES
    

    chart.redraw();
}

$(function (){
	init_charts();

	$('[data-chart-type="focus"]').click(function (e){
        var new_data = get_focus_data();
		diff_chart_data(new_data);
        current_chart_data = new_data;
		e.preventDefault();
	});
    $('[data-chart-type="generosity"]').click(function (e){
        var new_data = get_generosity_data();
        diff_chart_data(new_data);
        current_chart_data = new_data;
        e.preventDefault();
    });
	
});