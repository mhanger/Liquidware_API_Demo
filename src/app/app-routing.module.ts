import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';
import { WelcomeComponent } from './welcome/welcome.component';

const appRoutes: Routes = [
  {path: '',redirectTo: 'workload', pathMatch: 'full'},
  { path: 'workload', component: HomeComponent, children: [
    {path: '', component: WelcomeComponent},
    {path: ':timeFrame/users', component: UsersComponent},
    {path: ':timeFrame/users/:user_id', component: UserDetailComponent }
  ]
},
  {path: 'not-found', component: PageNotFoundComponent },
  {path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
