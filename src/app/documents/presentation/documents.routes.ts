import {Routes} from '@angular/router';

const documentValidationStatus = () =>
  import('./views/document-validation-status/document-validation-status').then(m => m.DocumentValidationStatus);

const baseTitle = 'LoadMatch';

/**
 * Routes of the Document Validation context, mounted under `/carrier` next to the Matching and Trip Execution routes.
 */
export const documentsRoutes: Routes = [
  { path: 'documents', loadComponent: documentValidationStatus, title: `${baseTitle} - Documents` },
];
