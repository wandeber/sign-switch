import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL;
const DB = process.env.DB;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const EMPLOYEE_NAME = process.env.EMPLOYEE_NAME;
const PIN = process.env.PIN;

const signInText = 'Ingrese su PIN para registrar su entrada';
const signOutText = 'Ingrese su PIN para registrar su salida';


class SignSwitch {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async run(signIn) {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    const result = await this.signSwitch(signIn);
    if (!result) {
      console.error('ERROR');
    }
    else {
      console.log(signIn ? 'SIGN IN CONFIRMED' : 'SIGN OUT CONFIRMED');
    }

    await this.page.screenshot({ path: 'screenshot.png' });
    // console.log('Screenshot saved!');

    await this.browser.close();
  }

  async signSwitch(signIn) {
    // Navegar a la base de datos
    await this.page.goto(`${BASE_URL}/web/database/selector#menu_id=195&action=277`);
    await this.page.waitForURL('**/web/database/selector#menu_id=195&action=277');
    await this.page.locator('.o_database_list a.list-group-item').getByText(DB).click();
    await this.page.waitForTimeout(1000);

    // Login
    await this.page.goto(`${BASE_URL}/web/login#menu_id=195&action=277`);
    await this.page.waitForURL('**/web/login#menu_id=195&action=277');
    await this.page.locator('#login').fill(EMAIL);
    await this.page.locator('#password').fill(PASSWORD);
    await this.page.locator('.oe_login_buttons button.btn-primary').click();
    await this.page.waitForURL('**/web#action=277');

    // Seleccionar empleado
    await this.page.goto(`${BASE_URL}/web#menu_id=195&action=277`);
    await this.page.locator('.o_hr_attendance_kiosk_mode button.o_hr_attendance_button_employees').click();
    await this.page.waitForURL('**/web#view_type=kanban&model=hr.employee&action=281');
    await this.page.locator(
      '.o_hr_employee_attendance_kanban .o_kanban_record .oe_kanban_details > div > strong > span'
    ).getByText(EMPLOYEE_NAME).click();

    // Introducir código PIN
    await this.page.waitForURL('**/web#action=hr_attendance_kiosk_confirm');
    
    if (typeof signIn === 'boolean') {
      const h2Text = signIn ? signInText : signOutText;
      //console.log('Texto a buscar', h2Text);
      try {
        await this.page.waitForSelector('h2:has-text("'+ h2Text +'")', { timeout: 5000 });
        // console.log('Elemento encontrado');
      }
      catch (error) {
        console.log('ALREADY '+ (signIn ? 'SIGNED IN' : 'SIGNED OUT'));
        return true;
      }
    }
    
    for (const character of PIN) {
      await this.page.locator(`.o_hr_attendance_pin_pad_button_${character}`).click();
    }

    await this.page.locator('.o_hr_attendance_pin_pad_button_ok').click();

    try {
      await this.page.waitForSelector(':has-text("registrada a")', { timeout: 5000 });
      return true;
    }
    catch (error) {
      console.error('ERROR');
    }

    return false;
  }
}

(async () => {
  const signSwitch = new SignSwitch();
  let signIn;
  if (process.argv.includes('--sign-in')) {
    signIn = true;
  }
  else if (process.argv.includes('--sign-out')) {
    signIn = false;
  }

  await signSwitch.run(signIn);
})();
