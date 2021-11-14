import { Route } from '@angular/router';
import { BiographyComponent } from './biography/biography.component';
import { CareerAspirationComponent } from './career-aspiration/career-aspiration.component';
import { PortfolioComponent } from './portfolio.component';
import { ProjectsComponent } from './projects/projects.component';
import { QualificationComponent } from './qualification/qualification.component';
import { TechSkillsComponent } from './tech-skills/tech-skills.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

// routes registrations
export const PORTFOLIO_ROUTING: Route = {
  path: '',
  component: PortfolioComponent,
  children: [
    {
      path: "biography",
      component: BiographyComponent
    },
    {
      path: "qualification",
      component: QualificationComponent
    },
    {
      path: "work-experience",
      component: WorkExperienceComponent
    },
    {
      path: "tech-skills",
      component: TechSkillsComponent
    },
    {
      path: "career-aspiration",
      component: CareerAspirationComponent
    },
    {
      path: "projects-overview",
      component: ProjectsComponent
    }
  ]
}
