import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  userid: string;
  
  constructor(private authservice : AuthService) { }
  
  ngOnInit() {
      this.authservice.getuserAuth().subscribe(user => {
        console.log(user);
        this.userid = user.uid;
      })
    }
}

