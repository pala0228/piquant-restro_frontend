import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiographyComponent } from './biography/biography.component';
import { QualificationComponent } from './qualification/qualification.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { TechSkillsComponent } from './tech-skills/tech-skills.component';
import { CareerAspirationComponent } from './career-aspiration/career-aspiration.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { PORTFOLIO_ROUTING } from './portfolio-routing.constants';
import { ProjectsComponent } from './projects/projects.component';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { PortfolioSideNavComponent } from './portfolio-side-nav/portfolio-side-nav.component';
import { PortfolioComponent } from './portfolio.component';

// routes configuration
const routes: Routes = [PORTFOLIO_ROUTING];

@NgModule({
  declarations: [
    PortfolioComponent,
    BiographyComponent,
    QualificationComponent,
    WorkExperienceComponent,
    TechSkillsComponent,
    CareerAspirationComponent,
    ProjectsComponent,
    PortfolioHeaderComponent,
    PortfolioSideNavComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule
  ],
  exports: [
    RouterModule,
    PortfolioComponent,
    BiographyComponent,
    QualificationComponent,
    WorkExperienceComponent,
    TechSkillsComponent,
    CareerAspirationComponent,
    PortfolioHeaderComponent,
    PortfolioSideNavComponent
  ],
  entryComponents: [],
  providers: []
})
export class PortfolioModule { }
