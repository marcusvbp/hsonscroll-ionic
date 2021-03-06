import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { Content } from 'ionic-angular';

@Directive({
  selector: '[hs-onscroll]'
})
export class Hsonscroll {

  initialMarginTop: string = "0";
  elHeight: number;
  initialScrollTop: number;
  elWidth: number;
  intervalCtrl: boolean = false;

  @Input('hs-onscroll') animationType: string;

  @Input('hs-showin') showin: number;

  @Input('hs-hidein') hidein: number;

  @Input('hs-relative') relative: boolean = false;

  @Input('hs-target') target: Content;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }
  ngOnInit() {
    if (this.animationType == "fabFade") {
      this.elHeight = this.el.nativeElement.scrollHeight;
      this.elWidth = this.el.nativeElement.scrollWidth;
    }
    if (this.animationType == "fade") {
      this.el.nativeElement.offsetParent.style.opacity = "0";
    }
    if (this.animationType == "fade" || this.animationType == "slideDown") {
      this.target.resize();
      this.elHeight = this.el.nativeElement.scrollHeight;
      this.initialMarginTop = this.el.nativeElement.style.marginTop;
      if (!this.relative) {
        this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', "-"+this.elHeight+"px");
      }
      setTimeout(()=> {
        this.renderer.setElementStyle(this.el.nativeElement, 'transition', "all .5s ease");
        this.renderer.setElementStyle(this.el.nativeElement, 'visibility', "visible");
      }, 500);
    }
  }

  ngAfterContentInit() {
    if (!this.initialMarginTop) {
      this.initialMarginTop = "0";
    }
    this.initialScrollTop = this.target.getContentDimensions().scrollTop;
    let positiveScroll: number;
    let negativeScroll: number;

    if (this.relative) {
      positiveScroll = this.initialScrollTop + this.showin;
      if (this.initialMarginTop == "0") {
        positiveScroll = this.showin;
      } else {
        positiveScroll = this.initialScrollTop + this.showin;
      }
      if (positiveScroll > this.target.getContentDimensions().scrollHeight) {
        positiveScroll = this.target.getContentDimensions().scrollHeight;
      }
      negativeScroll = Math.max(0,this.initialScrollTop-this.hidein);
    }

    let opacity:number = 0;
    let increase:number = (1+opacity)/this.showin;
    this.target.ionScroll.subscribe(($event: any) => {
      if (this.animationType == "fade") {
        if (!this.relative) {
          this.target._scrollEle.style.marginTop = "0";
          this.target._scrollEle.style.marginTop = "0 !important";
          this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', this.initialMarginTop);
          opacity = increase*this.target.getContentDimensions().scrollTop;
          if (this.target.getContentDimensions().scrollTop >= this.showin) {
            this.renderer.setElementStyle(this.el.nativeElement, 'opacity', opacity+"");
            this.el.nativeElement.offsetParent.style.opacity = opacity;
          }
          if (this.target.getContentDimensions().scrollTop < this.hidein) {
            this.renderer.setElementStyle(this.el.nativeElement, 'opacity', opacity+"");
            this.el.nativeElement.offsetParent.style.opacity = opacity;

          }
        }
      }
      if (this.animationType == "slideDown") {
        if (!this.relative) {
          if (this.target.getContentDimensions().scrollTop >= this.showin) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', this.initialMarginTop);
          }
          if (this.target.getContentDimensions().scrollTop < this.hidein) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', "-"+this.elHeight+"px");
          }
        } else {
          if (this.target.getContentDimensions().scrollTop >= positiveScroll) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', "-"+this.elHeight+"px");
            positiveScroll = this.target.getContentDimensions().scrollTop+this.showin;
            negativeScroll = Math.max(0,this.target.getContentDimensions().scrollTop-this.hidein);
          } else {
            if (this.target.getContentDimensions().scrollTop <= negativeScroll) {
              this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', this.initialMarginTop);
              positiveScroll = this.target.getContentDimensions().scrollTop+this.showin;
              negativeScroll = Math.max(0,this.target.getContentDimensions().scrollTop-this.hidein);
            }
          }

          this.contentResizer();
        }
      }
      if (this.animationType == "fabFade") {

      }
      if (this.animationType == "fabFade" && this.relative) {
        if (this.target.getContentDimensions().scrollTop >= positiveScroll) {
          this.renderer.setElementStyle(this.el.nativeElement, 'width', "20px");
          this.renderer.setElementStyle(this.el.nativeElement, 'height', "20px");
          this.renderer.setElementStyle(this.el.nativeElement, 'opacity', "0");
          this.el.nativeElement.firstElementChild.disabled = true;
          positiveScroll = this.target.getContentDimensions().scrollTop+this.showin;
          negativeScroll = Math.max(0,this.target.getContentDimensions().scrollTop-this.hidein);
        } else {
          if (this.target.getContentDimensions().scrollTop <= negativeScroll) {
            this.renderer.setElementStyle(this.el.nativeElement, 'width', this.elWidth+"px");
            this.renderer.setElementStyle(this.el.nativeElement, 'height', this.elHeight+"px");
            this.renderer.setElementStyle(this.el.nativeElement, 'opacity', "1");
            this.el.nativeElement.firstElementChild.disabled = false;
            positiveScroll = this.target.getContentDimensions().scrollTop+this.showin;
            negativeScroll = Math.max(0,this.target.getContentDimensions().scrollTop-this.hidein);
          }
        }
      }
    })
  }

  contentResizer() {
    if (this.intervalCtrl == false) {
      let i = 0;
      this.intervalCtrl = true;
      let interval = setInterval(()=>{
        this.target.resize();
        i++;
        if (i == 20) {
          this.intervalCtrl = false;
          clearInterval(interval);
        }
      }, 25);
    }
  }

}
