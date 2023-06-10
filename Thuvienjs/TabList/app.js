const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$('.tab-item');
const panes = $$('.tab-pane');
const line =  $('.line');
const lineActive = function() {
  line.style.left = $('.tab-item.active').offsetLeft + 'px';
  line.style.width = $('.tab-item.active').offsetWidth + 'px';
}


tabs.forEach((tab, i ) => {
  lineActive();
  const pane = panes[i];
  tab.onclick = function  () {
    $('.tab-item.active').classList.remove('active');
    $('.tab-pane.active').classList.remove('active');
    
    this.classList.add('active');
    pane.classList.add('active');
    lineActive();
  }
})
