import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Calendar} from './calendar/calendar';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [
    RouterOutlet,
    Calendar
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('SupervisionDashobard');

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'green-check',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/green-check.svg')
    );
    this.iconRegistry.addSvgIcon(
      'warning_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/warning_outline.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add_alert',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_alert.svg')
    );
    this.iconRegistry.addSvgIcon(
      'ellipse_blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ellipse_blue.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow_drop_down',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_drop_down.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-simple-left',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-simple-left.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-simple-right',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-simple-right.svg')
    );
  }
}
