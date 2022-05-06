const PIN = Cypress.env('PIN');
const DB = Cypress.env('DB');
const EMAIL = Cypress.env('EMAIL');
const PASSWORD = Cypress.env('PASSWORD');
const BASE_URL = Cypress.env('BASE_URL');

const signInText = 'Ingrese su PIN para registrar su entrada';
const signOutText = 'Ingrese su PIN para registrar su entrada';



Cypress.config('baseUrl', BASE_URL);



export const signSwitch = (signIn = true) => {
  cy.visit('/web/database/selector#menu_id=195&action=277');
  cy.url().should('contains', '/web/database/selector#menu_id=195&action=277');
  cy.get('.o_database_list a.list-group-item').contains(DB).click();
  cy.wait(1000);

  // Login:
  cy.visit('/web/login#menu_id=195&action=277');
  cy.url().should('contains', '/web/login#menu_id=195&action=277');
  //cy.get('#login').click();
  cy.get('#login').type(EMAIL);
  //cy.get('#password').click();
  cy.get('#password').type(PASSWORD);
  cy.get('.oe_login_buttons button.btn-primary').click();
  cy.url().should('contains', '/web#action=277');

  // Select emproyee:
  cy.visit('/web#menu_id=195&action=277');
  cy.get('.o_hr_attendance_kiosk_mode button.o_hr_attendance_button_employees').click();
  cy.url().should('contains', '/web#view_type=kanban&model=hr.employee&action=281');
  cy.get('.o_hr_employee_attendance_kanban .o_kanban_record .oe_kanban_details > div > strong > span').contains('Bernardo').click();
  
  // Type code:
  const h2Text = signIn ? signInText : signOutText;
  cy.url().should('contains', '/web#action=hr_attendance_kiosk_confirm');
  cy.get('h2').contains(h2Text);
  PIN?.split?.('').forEach(
    (character) => cy.get(`.o_hr_attendance_pin_pad_button_${character}`).click()
  );

  //cy.get('.o_hr_attendance_pin_pad_button_ok').click();
};
