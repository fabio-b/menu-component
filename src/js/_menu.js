//Keep the code modular, array will control the dropdown component
let menu = {
	'front_end': [{
		'name': 'HTML'
	},{
		'name': 'JS'
	},{
		'name': 'CSS',
		'more_options': [{
			'name': 'Pre Processors',
			'tags': ['LESS', 'SASS']
		},{
			'name': 'Post Processors',
			'tags': ['PostCSS']
		}]
	}],'back_end': [{
		'name': 'PHP'
	},{
		'name': 'Ruby'
	},{
		'name': 'Groovy'
	}]
}

function outputMenu(cat){
	var list = '<ul class="dropdown-menu">',
		output = '';
		
	output += list;
	for(var n=0;n<menu[cat].length;n++){
		if(menu[cat][n].more_options){
			output += '<li class="dropdown dropdown-submenu">';
			output += '<a href="#">'+menu[cat][n].name+'</a>'+list;
			for(var j=0;j<menu[cat][n].more_options.length;j++){
				output += '<li class="dropdown-header">'+menu[cat][n].more_options[j].name+'</li>';
				for(var i=0;i<menu[cat][n].more_options[j].tags.length;i++){
					output += '<li><a href="#">'+menu[cat][n].more_options[j].tags[i];
					output += '<span class="menu-icon glyphicon glyphicon-check hidden"></span></a>';
					output += '</li>';
				}
			}
		}else{
			output += '<li>';
			output += '<a href="#">'+menu[cat][n].name;
			output += '<span class="menu-icon glyphicon glyphicon-check hidden"></span></a>';
		}
		output += '</li>';
	}
	output += '</ul>';
	
	return output;
}