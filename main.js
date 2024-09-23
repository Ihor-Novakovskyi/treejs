const targetElement = document.querySelectorAll(`.canvas-element`)[1];
console.log(targetElement)
function setCanvasElementCenterPosition(targetClass, parentClass) {
    console.log('work')
    const targetElement = document.querySelector(`.${targetClass}`);
    const parent = document.querySelector(`.${parentClass}`);
    const heightParentElement = parent.scrollHeight;
    const widthParentElement = parent.scrollWidth;
    const heightTargetElement = targetElement.scrollHeight;
    const widthTargetElement = targetElement.scrollWidth;
    const distanceToPositionTargetelementInCenterVertical = (heightParentElement / 2) - (heightTargetElement / 2);
    const distanceToPositionTragetElementInCenterHorisontal = (widthParentElement / 2) - (widthTargetElement / 2);
   
    return {
        x: distanceToPositionTragetElementInCenterHorisontal,
        y: distanceToPositionTargetelementInCenterVertical,
        topDistance: parent.getBoundingClientRect().top,
    }
}
const offsets = setCanvasElementCenterPosition('canvas-element', 'container');
console.log(offsets)

function getScrollSection(parentClass = 'container') { 
    const parent = document.querySelector(`.${parentClass}`);

}

function scroll(e) { 
    console.log('windowScrollY',window.scrollY)
    const scrollY = window.scrollY;//window.pageYOffset
    const parent = document.querySelectorAll(`.container`)[1];
    const topContainer = parent.getBoundingClientRect().top + scrollY;
    const heightParentElement = parent.scrollHeight;
    const widthParentElement = parent.scrollWidth;
    // console.log('top',topContainer)
    const  windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const allPageHeight= document.body.scrollHeight;
    // console.log("windowWidth - ", windowWidth, "windowHeight", windowHeight, "scrollY - ", scrollY, 'allpageHeight',allPageHeight)
    // console.log('top', scrollY + topContainer)
    if (topContainer - windowHeight >= 0) {
        // scrollY - (topContainer - windowHeight) === 0 значит скролл дошел до элемента
        if (scrollY - (topContainer - windowHeight) >= 0) {//здесь фиксированній размер - topContainer - windowHeight. Условие выполняетс когда боттом окна дошел о топа элемента.Тоесть мы доскролилии относительно нижнией точки окна
            if (scrollY - (topContainer - windowHeight) - targetElement.scrollHeight >= 0) {//высчитывание скрола внтри элемента когда мы до него дошли
                // будет выполняться если доскролен или уже проскролен()
                const offSet = (scrollY - (topContainer - windowHeight)) / 2; //делю на 2 чтоб медленней прокручивалось
                const x = (offSet / offsets.y) * offsets.x;//соотношение лучше всего брать отсюда
                console.log('weoksss')
                if (offSet <= offsets.y) {// условие, то сколько ты проскролил когда дошел до элемента, должно быть меншьше
                    // расстояния от вреха элемента до того момента чтоб дочерний расположился по центру элемента 
                    // targetElement.style.transform = `translate(${offSet * offsets.ratio}px,${offSet}px)`
                    targetElement.style.transform = `translate(${x}px,${offSet}px)`
    
                } else {
                    targetElement.style.transform = `translate(${offsets.x}px,${offsets.y}px)`;
                }
                console.log('i`m inside container ')
            } else {
                // условие, когда элемент не доскролен, или мы полднялись выше него
                targetElement.style.transform = `translate(0px,0px)`;
            }
        } else { 
            targetElement.style.transform = `translate(-100%,-100%)`;
        }
       
    } else { 
        console.log('we in elelemnt that not to scroll');

    }
}

document.addEventListener('scroll', scroll)





//     const targetElement = document.querySelector(`.${targetClass}`);
//     const parent = document.querySelector(`.${parentClass}`);
//     const prevElement = targetElement.previousElementSibling;
//     const coordinatesParentElement = parent.getBoundingClientRect();
//     const coordinatesPrevElement = prevElement ? prevElement.getBoundingClientRect() : null;
//     const occupiedSizePrevElements = coordinatesPrevElement.bottom - coordinatesParentElement.top;
//     const heightParentElement = parent.scrollHeight;
//     const widthParentElement = parent.scrollWidth;
//     const heightTargetElement = targetElement.scrollHeight;
//     const widthTargetElement = targetElement.scrollWidth;
//     const marginTopOfTargetElement = (heightParentElement / 2) - occupiedSizePrevElements - (heightTargetElement / 2);
//     const distanceToleftEdge = (widthParentElement / 2) - (widthTargetElement / 2);
//     console.log(widthParentElement / 2)
//     targetElement.style.marginTop = `${marginTopOfTargetElement}px`;
    
//     // targetElement.style.marginLeft = `${distanceToleftEdge}px`;


// // высотка всего контейнера
//     // растояние до вреха контейнера
//     // низ соседа
//     // низ соседа - верх клотейнера = смещение соседа отнсительно начала контейнера
//     // середина  = высоту конейтенар делим на 2
//     // середина - смещение соседа отнсительно начала контейнера = сколько нужно до цента
//     // высота целевого элемента делим на два
//     // марджин топ целевого элемента = сколько нужно до цента - высота целевого элемента делим на два 
// }
// setCanvasElementCenterPosition('canvas-element', 'container');