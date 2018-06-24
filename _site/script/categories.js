(function() {
  var category, hideCategory;

  hideCategory = function(name) {
    var i, len, listCat, val;
    listCat = document.querySelectorAll('.category-details:not([data="' + category + '"])');
    for (i = 0, len = listCat.length; i < len; i++) {
      val = listCat[i];
      val.classList.add('hide');
    }
    return document.querySelector('.category-details:not(.hide)').setAttribute('open', '');
  };

  category = location.pathname.split("/").pop();

  if (category) {
    category = category.replace(/\/$/, '');
    hideCategory(category);
  }

}).call(this);
