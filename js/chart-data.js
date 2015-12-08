---
---


function chart_data(){
    var chart_data = 
        [
            {% for person in site.data.persons%}
              {
                "Ranking": {{ person.['Ranking'] }},
                "Name Eng": '{{ person.['Name Eng'] }}',
                "Name CN": '{{ person.['Name CN'] }}',
                "Total Amount (million Yuan)": {{ person.['Total Amount (million Yuan)'] }},
                "From Province": '{{ person.['From Province'] }}',
                "Province CN": '{{ person.['Province CN'] }}',
                "Age": {{ person.['Age'] }},
                "Generosity": '{{ person.['Generosity'] }}',
                "Industry": '{{ person.['Industry'] }}',
                "Industry CN": '{{ person.['Industry CN'] }}',
                "Education": {{ person.['Education'] }},
                "Environment": {{ person.['Environment'] }},
                "Healthcare": {{ person.['Healthcare'] }},
                "Social Welfare": {{ person.['Social Welfare'] }},
                "Disaster Relief": {{ person.['Disaster Relief'] }},
                "Culture": {{ person.['Culture'] }},
                id: uuid.v4()
              },
            {% endfor %}
        ];
    chart_data = chart_data.sort(function(a, b){
            if (b['Industry'] == 'Other')
                return -1;
            return 1;
        });
    return chart_data;
}

function chart_month_data(){

    var chart_month_data = 
    [
        {% for month in site.data.months%}    
          {
            "Month": "{{ month.['Month'] }}",
            "Amount": {{ month.['Amount'] }},
            id: uuid.v4()
          },
        {% endfor %}      
    ];
    return chart_month_data;
}

function map_chart_data(){
    var map_chart_data = [
        {% for map in site.data.maps%}
          {
            "Province": "{{map.['Province']}}",
            "Total amount received": {{map.['Total amount received']}},
            "Total giving amount": {{map.['Total giving amount']}},
            "Philanthropists": {{map.['Philanthropists']}},
            "Leader": "{{map.['Leader']}}",
            "Beijing": {{map.['Beijing']}},
            "Chongqing": {{map.['Chongqing']}},
            "Fujian": {{map.['Fujian']}},
            "Gansu": {{map.['Gansu']}},
            "Guangdong": {{map.['Guangdong']}},
            "Guangxi": {{map.['Guangxi']}},
            "Guizhou": {{map.['Guizhou']}},
            "Hebei": {{map.['Hebei']}},
            "Heilongjiang": {{map.['Heilongjiang']}},
            "Henan": {{map.['Henan']}},
            "Hubei": {{map.['Hubei']}},
            "Hunan": {{map.['Hunan']}},
            "Jiangsu": {{map.['Jiangsu']}},
            "Jiangxi": {{map.['Jiangxi']}},
            "Jilin": {{map.['Jilin']}},
            "Liaoning": {{map.['Liaoning']}},
            "Multiple Locations": {{map.['Multiple Locations']}},
            "Nepal": {{map.['Nepal']}},
            "Ningxia": {{map.['Ningxia']}},
            "Shaanxi": {{map.['Shaanxi']}},
            "Shandong": {{map.['Shandong']}},
            "Shanghai": {{map.['Shanghai']}},
            "Shanxi": {{map.['Shanxi']}},
            "Sichuan": {{map.['Sichuan']}},
            "Tianjin": {{map.['Tianjin']}},
            "Tibet": {{map.['Tibet']}},
            "US": {{map.['US']}},
            "Xinjiang": {{map.['Xinjiang']}},
            "Yunnan": {{map.['Yunnan']}},
            "Zhejiang": {{map.['Zhejiang']}},
          },
       {% endfor %}  
    ];
    return map_chart_data;
}


function region_location(){

    var regions = [
        {
            "Province": "Anhui",
            "Province CN": "安徽",
            "Latitude": 475.5,
            "Longitude": 307.5
        },
        {
            "Province": "Beijing",
            "Province CN": "北京",
            "Latitude": 455.5,
            "Longitude": 190.5
        },
        {
            "Province": "Chongqing",
            "Province CN": "重庆",
            "Latitude": 360.5,
            "Longitude": 340.5
        },
        {
            "Province": "Fujian",
            "Province CN": "福建",
            "Latitude": 496.5,
            "Longitude": 398.5
        },
        {
            "Province": "Sichuan",
            "Province CN": "四川",
            "Latitude": 300.5,
            "Longitude": 330.5
        },
        {
            "Province": "Gansu",
            "Province CN": "甘肃",
            "Latitude": 325.5,
            "Longitude": 260.5
        },
        {
            "Province": "Qinghai",
            "Province CN": "青海",
            "Latitude": 235.5,
            "Longitude": 245.5
        },
        {
            "Province": "Tibet",
            "Province CN": "西藏",
            "Latitude": 150.5,
            "Longitude": 305.5
        },
        {
            "Province": "Xinjiang",     
            "Province CN": "新疆",       
            "Latitude": 122.5,
            "Longitude": 167.5
        },
        {
            "Province": "Yunnan",            
            "Province CN": "云南",
            "Latitude": 280.5,
            "Longitude": 415.5
        },
        {
            "Province": "Guangxi",      
            "Province CN": "广西",      
            "Latitude": 370.5,
            "Longitude": 425.5
        },
        {
            "Province": "Guangdong",  
            "Province CN": "广东",          
            "Latitude": 435.5,
            "Longitude": 450.5
        },
        {
            "Province": "Guizhou",     
            "Province CN": "贵州",       
            "Latitude": 350.5,
            "Longitude": 385.5
        },
        {
            "Province": "Hainan",  
            "Province CN": "海南",          
            "Latitude": 385.5,
            "Longitude": 495.5
        },
        {
            "Province": "Hunan",   
            "Province CN": "湖南",         
            "Latitude": 410.5,
            "Longitude": 375.5
        },
        {
            "Province": "Jiangxi",  
            "Province CN": "江西",          
            "Latitude": 455.5,
            "Longitude": 375.5
        },
        {
            "Province": "Taiwan",
            "Province CN": "台湾",            
            "Latitude": 530.5,
            "Longitude": 415.5
        },
        {
            "Province": "Zhejiang",
            "Province CN": "浙江",            
            "Latitude": 520.5,
            "Longitude": 341.5
        },
        {
            "Province": "Shanghai",    
            "Province CN": "上海",        
            "Latitude": 524.5,
            "Longitude": 315.5
        },
        {
            "Province": "Jiangsu",  
            "Province CN": "江苏",          
            "Latitude": 510.5,
            "Longitude": 285.5
        },
        {
            "Province": "Hubei",     
            "Province CN": "湖北",       
            "Latitude": 410.5,
            "Longitude": 320.5
        },
        {
            "Province": "Henan",
            "Province CN": "河南",            
            "Latitude": 425.5,
            "Longitude": 280.5
        },
        {
            "Province": "Shaanxi",  
            "Province CN": "陕西",          
            "Latitude": 375.5,
            "Longitude": 280.5
        },
        {
            "Province": "Ningxia",  
            "Province CN": "宁夏",          
            "Latitude": 345.5,
            "Longitude": 235.5
        },
        {
            "Province": "Inner Mongolia",     
            "Province CN": "内蒙古",       
            "Latitude": 395.5,
            "Longitude": 175.5
        },
        {
            "Province": "Shanxi",    
            "Province CN": "山西",        
            "Latitude": 415.5,
            "Longitude": 235.5
        },
        {
            "Province": "Hebei",            
            "Province CN": "河北",
            "Latitude": 445.5,
            "Longitude": 225.5
        },
        {
            "Province": "Shandong",   
            "Province CN": "山东",         
            "Latitude": 485.5,
            "Longitude": 245.5
        },
        {
            "Province": "Tianjin",  
            "Province CN": "天津",          
            "Latitude": 470.5,
            "Longitude": 208.5
        },
        {
            "Province": "Liaoning",  
            "Province CN": "辽宁",          
            "Latitude": 520.5,
            "Longitude": 180.5
        },
        {
            "Province": "Jilin",   
            "Province CN": "吉林",         
            "Latitude": 560.5,
            "Longitude": 140.5
        },
        {
            "Province": "Heilongjiang",
            "Province CN": "黑龙江",            
            "Latitude": 560.5,
            "Longitude": 85.5
        },
        {
            "Province": "Nepal",
            "Province CN": "尼泊尔",            
            "Latitude": 0,
            "Longitude": 0
        },
        {
            "Province": "US",
            "Province CN": "美国",            
            "Latitude": 0,
            "Longitude": 0
        }
    ];

    return regions;
}