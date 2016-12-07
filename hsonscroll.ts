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

  @Input('hs-onscroll') animationType: string;

  @Input('hs-showin') showin: number;

  @Input('hs-hidein') hidein: number;

  @Input('hs-relative') relative: boolean = false;

  @Input('hs-target') target: Content;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }
  ngOnInit() {
    if (this.animationType == "slideDown") {
      this.elHeight = this.el.nativeElement.scrollHeight;

      this.initialMarginTop = this.el.nativeElement.style.marginTop;
    }
    if (this.animationType == "fabFade") {
      this.elHeight = this.el.nativeElement.scrollHeight;
      this.elWidth = this.el.nativeElement.scrollWidth;

    }

    if (this.animationType == "slideDown") {
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
    this.initialScrollTop = this.target.getScrollTop();
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

    this.target.addScrollListener((event)=>{
      if (this.animationType == "slideDown") {
        if (!this.relative) {
          if (this.target.getScrollTop() >= this.showin) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', this.initialMarginTop);
          }
          if (this.target.getScrollTop() < this.hidein) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', "-"+this.elHeight+"px");
          }
        } else {
          this.target.resize();
          if (this.target.getScrollTop() >= positiveScroll) {
            this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', "-"+this.elHeight+"px");
            positiveScroll = this.target.getScrollTop()+this.showin;
            negativeScroll = Math.max(0,this.target.getScrollTop()-this.hidein);
          } else {
            if (this.target.getScrollTop() <= negativeScroll) {
              this.renderer.setElementStyle(this.el.nativeElement, 'marginTop', this.initialMarginTop);
              positiveScroll = this.target.getScrollTop()+this.showin;
              negativeScroll = Math.max(0,this.target.getScrollTop()-this.hidein);
            }
          }
        }
      }
      if (this.animationType == "fabFade" && this.relative) {
        if (this.target.getScrollTop() >= positiveScroll) {
          this.renderer.setElementStyle(this.el.nativeElement, 'width', "20px");
          this.renderer.setElementStyle(this.el.nativeElement, 'height', "20px");
          this.renderer.setElementStyle(this.el.nativeElement, 'opacity', "0");
          this.el.nativeElement.firstElementChild.disabled = true;
          positiveScroll = this.target.getScrollTop()+this.showin;
          negativeScroll = Math.max(0,this.target.getScrollTop()-this.hidein);
        } else {
          if (this.target.getScrollTop() <= negativeScroll) {
            this.renderer.setElementStyle(this.el.nativeElement, 'width', this.elWidth+"px");
            this.renderer.setElementStyle(this.el.nativeElement, 'height', this.elHeight+"px");
            this.renderer.setElementStyle(this.el.nativeElement, 'opacity', "1");
            this.el.nativeElement.firstElementChild.disabled = false;
            positiveScroll = this.target.getScrollTop()+this.showin;
            negativeScroll = Math.max(0,this.target.getScrollTop()-this.hidein);
          }
        }
      }
    })
  }

}
