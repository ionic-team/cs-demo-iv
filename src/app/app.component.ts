import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { DefaultSession } from '@ionic-enterprise/identity-vault';
import { Plugins, StatusBarStyle } from '@capacitor/core';

import { IdentityService } from './services/identity';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private identity: IdentityService,
    private navController: NavController,
    private platform: Platform,
  ) {
    this.initializeApp();
    this.identity.changed.subscribe(session =>
      this.handleSessionChange(session),
    );
  }

  async initializeApp() {
    const { SplashScreen, StatusBar } = Plugins;
    await this.identity.ready();
    this.identity.get();
    if (this.platform.is('hybrid')) {
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#3171e0' });
      }
    }
  }

  private handleSessionChange(session: DefaultSession) {
    if (session) {
      this.navController.navigateRoot(['tabs', 'home']);
    } else {
      this.navController.navigateRoot(['login']);
    }
  }
}
