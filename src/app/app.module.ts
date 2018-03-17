import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// modules
import { FormsModule } from '@angular/forms';
import { RoutesModule } from './routes/routes.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// services
import { UportService } from './services/uport/uport.service';
import { Web3Service } from './services/web3/web3.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrganizationService } from './services/organization/organization.service';
import { LocalStorageService } from './services/localStorage/local-storage.service';
import { HomeComponent } from './components/home/home.component';
import { MedicationService } from './services/medication/medication.service';
import { UserService } from './services/user/user.service';
import { AdminComponent } from './components/admin/admin.component';
import { TransactionService } from './services/transaction/transaction.service';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, HomeComponent, AdminComponent],
  imports: [BrowserModule, FormsModule, RoutesModule, AngularFontAwesomeModule],
  providers: [UportService, Web3Service, LocalStorageService, UserService, OrganizationService, MedicationService, TransactionService],
  bootstrap: [AppComponent],
})
export class AppModule {}
