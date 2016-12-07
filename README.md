# hsonscroll-ionic
**Hide or Show on Scroll** is a Directive for hide or show elements on screen scroll for Ionic (version 2) Framework App.

<iframe width="560" height="315" src="https://www.youtube.com/embed/s8CbK_ltpps" frameborder="0" allowfullscreen></iframe>

## How to use

1. clone or download the repository and place the directive folder in */src/app/components* directory
2. register the directive in */app/app.module.ts*:

```
@NgModule({
  declarations: [
    MyApp,
    Hsonscroll,
    ...
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ...
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
```
3. Place an Id in the *<ion-content>* component:
```
<ion-content #targetcontent>
```

4. Currently the directive was suited to work with navbar placed in header and FAB buttons (see the video in this page). The directive implements the following attributes:

 - hs-onscroll - **required**: accept two values: *slideDown* (for navbars) and *fabFade* (for FAB buttons)
 - [hs-target] - **required**: reffers to *<ion-content>* component (example: **[hs-target]="targetcontent"**)
 - [hs-showin] - **required**: a number referring to how much the scroll needs to scroll to show the element
 - [hs-hidein] - **required**: a number referring to how much the scroll needs to scroll to hide the element
 - hs-relative - **optional, boolean**: if set true, the hide/sholl is based on current scroll position (example: the navbar and FAB button on the Home Screen of the video above)

## examples

### 1. Navbar is hide and show after the scroll rolls 200 pixels, and hide again if the scroll rolls -60 pixels
```
<ion-header>

  <ion-navbar hs-onscroll="slideDown" [hs-target]="targetcontent" [hs-showin]="200" [hs-hidein]="60">
    <ion-title>Detalhes de pelúcio</ion-title>

    <ion-buttons end>
      <button ion-button (click)="showPopover($event)"><ion-icon name="more"></ion-icon></button>
    </ion-buttons>
  </ion-navbar>

</ion-header>


<ion-content #targetcontent>
(...)
```

### 2. Navbar and FAB Button show/hide if the scroll change to "current position + 56" or "current position - 56"
```
<ion-header>

  <ion-navbar hs-onscroll="slideDown" [hs-target]="targetcontent" [hs-showin]="56" [hs-hidein]="56" hs-relative="true">
    <ion-title>Meus pets</ion-title>

    <ion-buttons end>
      <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    </ion-buttons>
  </ion-navbar>

  <ion-toolbar>
    <ion-list class="list-filter" no-lines>
      <ion-item>
        <ion-icon name="funnel" item-left></ion-icon>
        <ion-input type="text" placeholder="Filtrar"></ion-input>
        <div item-right>
          <button ion-button clear color="dark" default (click)="changeListStyle('small-card-list', 'small')"><ion-icon name="contract"></ion-icon></button>
          <button ion-button clear color="dark" default (click)="changeListStyle('card-background-page', 'large')"><ion-icon name="expand"></ion-icon></button>
        </div>
      </ion-item>
    </ion-list>
  </ion-toolbar>

</ion-header>


<ion-content #targetcontent>

<ion-fab bottom right hs-onscroll="fabFade" [hs-target]="targetcontent" [hs-showin]="56" [hs-hidein]="56" hs-relative="true" #fab>
  <button ion-fab color="danger"><ion-icon name="add"></ion-icon></button>
</ion-fab>
```
