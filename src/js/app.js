$(document).on('click', '.dropdown-menu', function(e) {
    e.stopPropagation();
});
$(document).on('click', '.dropdown-menu li', function(){
	$(this).children('a').children().toggleClass('hidden');
})