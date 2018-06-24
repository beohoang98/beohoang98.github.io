---
---

hideCategory = (name) ->
	listCat = document.querySelectorAll('.category-details:not([data="' + category + '"])')
	for val in listCat
		val.classList.add('hide')
	document.querySelector('.category-details:not(.hide)').setAttribute('open', '')

category = location.pathname.split("/").pop()
if (category)
	category = category.replace(/\/$/, '')
	hideCategory category