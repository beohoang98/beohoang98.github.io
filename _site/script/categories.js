(function() {
  var category, i, len, listCat, val;

  category = location.pathname.split("/").pop();

  if (category) {
    category = category.replace(/\/$/, '');
  }

  listCat = document.querySelectorAll('.category-details:not([data="' + category + '"])');

  for (i = 0, len = listCat.length; i < len; i++) {
    val = listCat[i];
    val.classList.add('hide');
  }

  document.querySelector('.category-details:not(.hide)').setAttribute('open', '');

}).call(this);
