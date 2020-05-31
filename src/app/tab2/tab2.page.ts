import { Component, ViewChild, ElementRef } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";
import { AlertController } from "@ionic/angular";
const { Geolocation } = Plugins;

import { CameraResultType, CameraPhoto, FilesystemDirectory, Capacitor } from "@capacitor/core";
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;
import { AngularFireStorage } from "@angular/fire/storage";


declare var google;
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  user = null;
  userid;
  map: any;
  markers = [];
  positions: Observable<any>;
  usersCollection: AngularFirestoreCollection<any>;
  userDoc;
  isTracking = false;
  watch: string;
  lat;
  lng;
  destination;
  PHOTO_STORAGE: string = "photos";
  photos;

  constructor(private afs: AngularFirestore, private authservice: AuthService, private platform: Platform, private storage: AngularFireStorage) {
    this.usersCollection = this.afs.collection(`users`);
    /* this.user = this.authservice.getuserAuth().subscribe(user => {
			this.userid = user.uid;
		  }); */
    this.userDoc = this.usersCollection.doc("2");

    this.destination = {};
	this.platform = platform;
	this.getMyPosition();
  }

  ionViewWillEnter() {
    this.loadMap();
  }

  // conseguir mi posicion y actualizar la DB
  getMyPosition() {
    //this.userDoc = this.usersCollection.doc(this.user);
    this.positions = this.userDoc
      .snapshotChanges()
      .pipe(map((doc) => (doc as any).payload.data().position));
    // actualizar en cada cambio
    this.positions.subscribe((positions) => {
      this.updateMap(positions);
    });
  }

  // inicializar el mapa
  loadMap() {
    let latLng = new google.maps.LatLng(-35.9036442, -57.6673267);

    let mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  async loadSaved() {
    // Retrieve cached photo array data
    const photos = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photos.value) || [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
        });
      
        // Web platform only: Save the photo into the base64 field
        photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;  
    }
  }

  async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's 
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
	const savedImageFile = await this.savePicture(image);
	
    var imageUrl = image.webPath;
    return imageUrl;

    // Can be set to the src of an image now
    //imageElement.src = imageUrl;
  }


  sendAlert() {
	let imgUrl = this.takePicture();
	const remotePath = 'alertPhotos/'+imgUrl;
	const ref = this.storage.ref(remotePath);
	const task = this.storage.upload(remotePath, imgUrl);
    /* this.userDoc.set({
			notifications: "panic",
			state: "sharing",
			position: {
				lat: this.lat,
				lng: this.lng,
			},
		}); */
  }

  // empezar a trackear
  startTracking() {
    this.isTracking = true;
    this.watch = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.addNewPosition(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        );
      }
    });

    this.positions.subscribe((positions) => {
      this.updateMap(positions);
    });
  }

  // cerrar la suscripción
  stopTracking() {
    Geolocation.clearWatch({ id: this.watch }).then(() => {
      this.isTracking = false;
    });
    this.userDoc.set({
      notification: "stopped",
    });
  }

  // guardar la ubicacion y actualizar el mapa
  addNewPosition(lat, lng, timestamp) {
    this.userDoc.set({
      position: {
        lat,
        lng,
      },
      timestamp,
      state: "sharing",
      destination: this.destination,
    });

    let position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(5);
  }

  placeMarker($event) {
    console.log($event);

    console.log($event.coords.lat);
    console.log($event.coords.lng);
  }

  updateMap(position) {
    this.markers.map((marker) => marker.setMap(null));
    this.markers = [];

    console.log(position);

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    console.log(latLng);

    /* latLng.event.addListener(map, "click", function (event) {
			let pos = event.latLng;
			console.log(pos);

			let lat = pos.lat();
			let lng = pos.lng();
			this.destination = { lat: lat, lng: lng };
			console.log(this.destination);
		}); */
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
    });
    //console.log(this.markers, marker);
    this.markers.push(marker);
  }
}
