function maps_helper(){

	var map_initial_data = map_chart_data();
	var region_data = region_location();

	var mapsHelper = {	

		diff_plots: function(current_plots, new_plots) {
			var deleted_plots = [];
			var updated_plots = {};
			var same_plots = [];
			var add_plots = {};

			$.each(current_plots, function(name, obj){
				if (!new_plots[name])
					deleted_plots.push(name);
				else {
					var isSame = JSON.stringify(obj) === JSON.stringify(new_plots[name]);
					if (!isSame){
						updated_plots[name] = new_plots[name];
					} else {
						same_plots.push([name, new_plots[name]]);
					}
				}
			});
			$.each(new_plots, function(name, obj){
				if (!current_plots[name])
					add_plots[name] = obj;
			});
			
			var res = {
				new_plots: add_plots,
				updated_plots: updated_plots,
				deleted_plots: deleted_plots,
				same_plots: same_plots
			};

			return res;
		},
		diff_areas: function(current_areas, new_areas) {
			var updated_areas = {};
			$.each(current_areas, function(name, obj){
				if (new_areas[name]) {
					var isSame = JSON.stringify(obj) === JSON.stringify(new_areas[name]);
					if (!isSame){
						updated_areas[name] = new_areas[name];
					}
				}
			});		
			return updated_areas;
		},

		diff_links: function(current_links, new_links) {
			var deleted_links = [];
			var add_links = {};

			$.each(current_links, function(name, obj){
				if (!new_links[name])
					deleted_links.push(name);
			});
			$.each(new_links, function(name, obj){
				if (!current_links[name])
					add_links[name] = obj;
			});
			
			var res = {
				new_links: add_links,
				deleted_links: deleted_links
			};

			return res;
		},
		fetch_province_data: function (province, property){
			var fetched = $.grep(map_initial_data, function(e){ return e['Province'] == province; });
			if (fetched.length > 0){
				var res = fetched[0][property];
				if (res === Number(res) && res % 1 !== 0)
					res = Math.round(res);
				return res;
			}
			return 0;
		},
		fetch_location_data: function (province){
			return $.grep(region_data, function(e){ return e['Province'] == province; })[0];
		},
		get_plot_size: function (val){
			if (!val)
				return 0;
			if (val <= 10)
				return 8;
			if (val <= 100)
				return 8 + val / 6;
			return 25 + val / 50;
		},
		get_plot_color:	function (val){
			var param = get_param();
			if (param == 'origins')
				return '#ff5454';
			if (param == 'destinations')
				return '#fffd72';
			if (param == 'flow')
				return '#F08219';
			return '#fff';
		},
		plots_philantropists: function (){
			var that = this;
			var res = {};
			$.each(map_initial_data, function(index, item){
				var info_name = item['Province'] + '_Info';				
				var val = that.fetch_province_data(item['Province'], 'Total giving amount');
				if (val) {
					var loc = that.fetch_location_data(item['Province']);
					if (loc && loc['Latitude'] > 0){
						var province_name = !is_chinese() ? item['Province'] : loc['Province CN'];
						res[info_name] = {
							value: val,
				            latitude: loc['Latitude'],
				            longitude: loc['Longitude'],
				            size: that.get_plot_size(val),
				            attrs: {
				            	fill: that.get_plot_color(val)
				            },
				            href: "javascript:void(0);",
				            tooltip: {
				                content: '<b>' + province_name + '</b> <br>' + 
				                		 (!is_chinese() ? '<b>Amount Donated:</b> ' : '<b>捐赠数额</b> ') + trsl_int('¥' + val + ' m') + '<br>' + 
				                		 (!is_chinese() ? '<b>Philanthropists:</b> ' : '<b>慈善家人数</b> ') + that.fetch_province_data(item['Province'], 'Philanthropists') + '<br>' + 
				                		 (!is_chinese() ? '<b>Leader:</b> ' : '<b>慈善领袖</b> ') + trsl_leader(that.fetch_province_data(item['Province'], 'Leader'))
				            }
						}
					}
				}
			});
			return res;			
		},
		plots_donations: function(){
			var that = this;
			var res = {};
			$.each(map_initial_data, function(index, item){
				var info_name = item['Province'] + '_Info';
				var val = that.fetch_province_data(item['Province'], 'Total amount received');
				if (val) {
					var loc = that.fetch_location_data(item['Province']);
					if (loc && loc['Latitude'] > 0){
						var province_name = !is_chinese() ? item['Province'] : loc['Province CN'];
						res[info_name] = {
							value: val,
				            latitude: loc['Latitude'],
				            longitude: loc['Longitude'],
				            size: that.get_plot_size(val),
				            attrs: {
				            	fill: that.get_plot_color(val)
				            },
				            href: "javascript:void(0);",
				            tooltip: {
				                content: '<b>' + province_name + '</b> <br>' + 
				                		 (!is_chinese() ? '<b>Amount Received:</b> ' : '<b>受捐数额</b> ' ) + trsl_int('¥' + val + ' m')
				            }
						}
					}
				}
			});
			return res;
		},

		plots_movements: function (){
			var that = this;
			var res = {};
			var pre_res = {};
			var gvng = !is_chinese() ? 'Donated' : '捐赠';
			var rcvd = !is_chinese() ? 'Received' : '受捐';

			$.each(map_initial_data, function(index, item){
				var info_name = item['Province'] + '_Info';
				var val = that.fetch_province_data(item['Province'], 'Total amount received');
				if (val) {
					var loc = that.fetch_location_data(item['Province']);
					if (loc && loc['Latitude'] > 0){
						var province_name = !is_chinese() ? item['Province'] : loc['Province CN'];				
						val -= that.fetch_province_data(item['Province'], item['Province']);

						var receiving_text = '<b>' + province_name + ' ' + rcvd + '</b> <br>';

						$.each(region_data, function(ind, region_item){
							var receiveing_amount = that.fetch_province_data(region_item['Province'], item['Province']);
							if (receiveing_amount > 0 && region_item['Province'] != item['Province']){
								receiving_text += '<b>' + (!is_chinese() ? region_item['Province'] : region_item['Province CN']) + ':</b> ' + trsl_int('¥' + receiveing_amount + ' m') + '<br>';
							}
						});

						pre_res[info_name] = {
							value: val,
				            latitude: loc['Latitude'],
				            longitude: loc['Longitude'],
				            size: that.get_plot_size(val),
				            attrs: {
				            	fill: '#fffd72'
				            },
				            href: "javascript:void(0);",
				            tooltip: {
				                content: receiving_text
				            }
						}
					}
				}
			});
			var receivings = [];
			$.each(map_initial_data, function(index, item){
				var info_name = item['Province'] + '_Info';
				var val = that.fetch_province_data(item['Province'], 'Total giving amount');
				if (val) {
					var loc = that.fetch_location_data(item['Province']);
					if (loc){
						var province_name = !is_chinese() ? item['Province'] : loc['Province CN'];						
						var tooltip_text = '<b>' + province_name + ' ' + gvng + '</b> <br>';
						var receiving_text = '<br><b>' + province_name + ' ' + rcvd + '</b> <br>';
						var giving = false;
						var receiving = false;
						$.each(region_data, function(ind, region_item){
							var giving_amount = item[region_item['Province']];
							if (region_item['Province'] != item['Province'] && giving_amount > 0) {
								giving = true;
								if ($.inArray(receivings, region_item['Province'] + '_Info') < 0 && that.fetch_location_data(region_item['Province'])['Latitude'] > 0)
									receivings.push(region_item['Province'] + '_Info');
								tooltip_text += '<b>' + (!is_chinese() ? region_item['Province'] : region_item['Province CN']) + ':</b> ' + trsl_int('¥' + giving_amount + ' m') + '<br>';
							}
							else if (region_item['Province'] == item['Province'] && giving_amount > 0 ){
								val -= giving_amount;
							}
							var receiveing_amount = that.fetch_province_data(region_item['Province'], item['Province']);
							if (receiveing_amount > 0 && region_item['Province'] != item['Province']){
								receiving = true;
								receivings.push(info_name);
								receiving_text += '<b>' + (!is_chinese() ? region_item['Province'] : region_item['Province CN']) + ':</b> ' + trsl_int('¥' + receiveing_amount + ' m') + '<br>';
							}
						});
						if (giving && loc['Latitude'] > 0) {
							res[info_name] = {
								value: val,
					            latitude: loc['Latitude'],
					            longitude: loc['Longitude'],
					            size: that.get_plot_size(val),
					            attrs: {
					            	fill: !receiving ? '#ff5454' : '#F08219'
					            },
					            href: "javascript:void(0);",
					            tooltip: {
					                content: tooltip_text + (receiving ? receiving_text : '')
					            }
							}
						}
					}
				}
			});

			$.each(receivings, function (index, item){
				if (!res[item])
					res[item] = pre_res[item];
			});
			
			return res;
		},

		links_movements: function (){
			var that = this;
			var res = {};

			$.each(map_initial_data, function(index, map_item){
				var loc_from = that.fetch_location_data(map_item['Province']); 
				if (loc_from){
					var province_name = !is_chinese() ? loc_from['Province'] : loc_from['Province CN'];
					$.each(region_data, function(ind, region_item){
						var region_name = region_item['Province'];
						if (map_item[region_name] && map_item[region_name] > 0){
							var link_name = 'link_' + map_item['Province'] + '_' + region_name;
							var loc_to = that.fetch_location_data(region_item['Province']);
							var province_region_name = !is_chinese() ? loc_to['Province'] : loc_to['Province CN'];
							var receiving_amount = that.fetch_province_data(map_item['Province'], region_item['Province']);
							if (loc_to['Latitude'] > 0){
								res[link_name] = {
						            factor : 0.2, 
						            between : [{latitude : loc_from['Latitude'], longitude : loc_from['Longitude']}, 
						            		   {latitude : loc_to['Latitude'], longitude : loc_to['Longitude']}], 
						            attrs : {
						            	stroke: "rgba(255, 255, 255, 0.15)",
						                "stroke-width" : 2
						            }, 
						            attrsHover : {
						            	stroke: "rgba(143, 253, 155, 0.75)",
						                "stroke-width" : 3
						            },
						            tooltip: { 
						            	content : '<b>' + province_name + ' → ' + province_region_name + '</b> <br> ' +
						            			  trsl_int('¥' + receiving_amount + ' Million')
						            }
						    	}
						    }	
						}
					});
				}
			});
			return res;
		},

		areas_philantropists: function (){
			var areas = {};
			$.each(region_data, function(ind, region_item){
				var region_name = region_item['Province'];
				var province_name = !is_chinese() ? region_item['Province'] : region_item['Province CN'];
				areas[region_name] = {
					tooltip: {content : '<b>' + province_name + '</b>'},
					attrs : {
						fill : "#8996A0", 
						stroke: "#FFFFFF"
					},
					title : region_name	
				}
			});
			return areas;
		},

		areas_donations: function (){
			var areas = {};
			$.each(region_data, function(ind, region_item){
				var region_name = region_item['Province'];
				var province_name = !is_chinese() ? region_item['Province'] : region_item['Province CN'];
				areas[region_name] = {
					tooltip: {content : '<b>' + province_name + '</b>'},
					attrs : {
						fill : "#8996A0", 
						stroke: "#FFFFFF"
					},
					title : region_name	
				}
			});
			return areas;
		},

		areas_movements: function (){
			var areas = {};
			$.each(region_data, function(ind, region_item){
				var region_name = region_item['Province'];
				var province_name = !is_chinese() ? region_item['Province'] : region_item['Province CN'];
				areas[region_name] = {
					tooltip: {content : '<b>' + province_name + '</b>'},
					attrs : {
						fill : "#8996A0", 
						stroke: "#FFFFFF"
					}
				}
			});
			return areas;			
		}
	};

	return mapsHelper;
}