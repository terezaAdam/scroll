let mainSlider = document.querySelector('.slider-main');
let innerSliderOne = document.querySelector('.slider-inner-one');
let innerSliderTwo = document.querySelector('.slider-inner-two');
let images = [...document.querySelectorAll('svg')];
let imagesItems = [];

let current = 0;
let target = 0;
let ease = 0.075;

window.addEventListener('resize', init);

function lerp(start, end, t){
    return start * (1 - t) + end * t;
}


function init(){
    document.body.style.height = `${mainSlider.getBoundingClientRect().width - (window.innerWidth - window.innerHeight)}px`
}

function transformElement(el, transform) {
    el.style.transform = transform;
}

function animate (){
    target = window.scrollY;
    current = lerp(current, target, ease).toFixed(2);
    transformElement(mainSlider, `translate3d(${-current}px, 0, 0)`);
    transformElement(innerSliderTwo, `translate3d(${-current*1.1}px, 0, 0)`);

    for(let i = 0; i < imagesItems.length; i++ ) {
        imagesItems[i].render();
        if(current < (target- 50) || current > target + 50){
            transformElement(imagesItems[i].el, 'scale(0.8)');
        }else{
            transformElement(imagesItems[i].el, 'scale(1)'); 
        }
    } 

    requestAnimationFrame(animate);
}

//Intersection observer options//
let options = {
    rootMargin: '0px',
    treshold: .9

}

class ImageItem{
    constructor(el){
        this.el = el;
        this.isVisible = false;
        this.observe = new IntersectionObserver(entries => {
            entries.forEach(entry => this.isVisible = entry.isIntersecting);
        });
        this.observe.observe(this.el);
        this.current = 150;
        this.target = 150;
        this.ease = 0.1;
        this.setDisplacement();
    }
    setDisplacement(){
        this.el.querySelector('feDisplacementMap').scale.baseVal = this.current;
    }
    render(){
        if(this.isVisible && this.target != 0 ){
            this.target = 0;
            this.el.classList.add('active');
        }
        this.current = lerp (this.current, this.target, this.ease).toFixed(2);
        this.el.querySelector('feDisplacementMap').scale.baseVal = this.current;
    }
}

images.forEach(image =>{
    imagesItems.push(new ImageItem(image))
})

init ()
animate();
