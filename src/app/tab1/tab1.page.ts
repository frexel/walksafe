import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";
import { AlertController} from '@ionic/angular'

const { Geolocation } = Plugins;


declare var google;
@Component({
	selector: "app-tab1",
	templateUrl: "tab1.page.html",
	styleUrls: ["tab1.page.scss"],
})

export class Tab1Page {
	constructor(private router: Router, private alertController: AlertController) {}

	ionViewWillEnter() {
		this.presentAlertPrompt();
	}

	// empezar a trackear
	startTracking() {
		this.router.navigate(["map"]);
	}

	//(click)="presentAlertPrompt()

	//alerta
	async presentAlert(){
		const alert = await this.alertController.create({
		  message: 'Queres borrar este contacto?',
		  buttons: ['Cancelar','Aceptar']
		});
	
		await alert.present();
	  } 
	
	  async presentAlertPrompt() {
		const alert = await this.alertController.create({
		  cssClass: 'my-custom-class',
		  header: 'Nombre Apellido',
		  message: "Está compartiendo su ubicación",
		  buttons: [
			{
			  text: 'Cancelar',
			  role: 'cancel',
			  cssClass: 'secondary',
			  handler: () => {
				console.log('Confirm Cancel');
			  }
			}, {
			  text: 'Aceptar',
			  handler: () => {
				//acá hay que hacer algo con la info pero no se que
				this.router.navigate(["map"]);
			}
			}
		  ]
		});
	
		await alert.present();
	  }

}
