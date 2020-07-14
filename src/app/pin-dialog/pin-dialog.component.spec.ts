import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { PinDialogComponent } from './pin-dialog.component';
import { createOverlayControllerMock } from '../../../test/mocks';

describe('PinDialogComponent', () => {
  let component: PinDialogComponent;
  let fixture: ComponentFixture<PinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PinDialogComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock('Modal'),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('set passcode mode', () => {
      beforeEach(() => {
        component.setPasscodeMode = true;
        fixture.detectChanges();
      });

      it('sets the title to "Create PIN"', () => {
        expect(component.title).toEqual('Create PIN');
      });

      it('sets the prompt to "Create Session PIN"', () => {
        expect(component.prompt).toEqual('Create Session PIN');
      });
    });

    describe('unlock mode', () => {
      beforeEach(() => {
        component.setPasscodeMode = false;
        fixture.detectChanges();
      });

      it('sets the title to "Unlock"', () => {
        expect(component.title).toEqual('Unlock');
      });

      it('sets the prompt to "Enter PIN to Unlock"', () => {
        expect(component.prompt).toEqual('Enter PIN to Unlock');
      });
    });
  });

  describe('disable input', () => {
    it('is false if the PIN is empty', () => {
      component.pin = '';
      expect(component.disableInput).toEqual(false);
    });

    it('is false if the PIN is 8 characters long', () => {
      component.pin = '83746512';
      expect(component.disableInput).toEqual(false);
    });

    it('is true if the PIN is 9 characters long', () => {
      component.pin = '837465123';
      expect(component.disableInput).toEqual(true);
    });
  });

  describe('disable delete', () => {
    it('is true if the PIN length is zero', () => {
      component.pin = '';
      expect(component.disableDelete).toEqual(true);
    });

    it('is false if the PIN length is non-zero', () => {
      component.pin = '123';
      expect(component.disableDelete).toEqual(false);
    });
  });

  describe('disable enter', () => {
    it('is true if the PIN length is zero', () => {
      component.pin = '';
      expect(component.disableEnter).toEqual(true);
    });

    it('is true if the PIN length is two', () => {
      component.pin = '73';
      expect(component.disableEnter).toEqual(true);
    });

    it('is false if the PIN length is three', () => {
      component.pin = '734';
      expect(component.disableEnter).toEqual(false);
    });

    it('is false if the PIN length is greater than three', () => {
      component.pin = '73498';
      expect(component.disableEnter).toEqual(false);
    });
  });

  describe('append', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('clears any error message', () => {
      component.errorMessage = 'I am error';
      component.append(3);
      expect(component.errorMessage).toEqual('');
    });

    it('appends the number to the PIN', () => {
      component.append(1);
      expect(component.pin).toEqual('1');
      component.append(8);
      expect(component.pin).toEqual('18');
      component.append(3);
      expect(component.pin).toEqual('183');
    });

    it('appends a * to the display PIN', () => {
      component.append(1);
      expect(component.displayPin).toEqual('*');
      component.append(8);
      expect(component.displayPin).toEqual('**');
      component.append(3);
      expect(component.displayPin).toEqual('***');
    });
  });

  describe('delete', () => {
    it('removes the last value from the PIN string', () => {
      component.pin = '1138';
      component.delete();
      expect(component.pin).toEqual('113');
    });

    it('does nothing if the pin is empty', () => {
      component.pin = '';
      component.delete();
      expect(component.pin).toEqual('');
    });

    it('sets the display PIN', () => {
      component.pin = '1138';
      component.delete();
      expect(component.displayPin).toEqual('***');
    });

    it('does nothing if the pin is empty', () => {
      component.pin = '';
      component.delete();
      expect(component.displayPin).toEqual('');
    });
  });

  describe('enter', () => {
    describe('set passcode mode', () => {
      beforeEach(() => {
        component.setPasscodeMode = true;
        fixture.detectChanges();
      });

      describe('first call', () => {
        it('does not dismiss', () => {
          const modalController = TestBed.inject(ModalController);
          component.pin = '88395';
          component.enter();
          expect(modalController.dismiss).not.toHaveBeenCalled();
        });

        it('sets the prompt to "Verify PIN"', () => {
          component.pin = '88395';
          component.enter();
          expect(component.prompt).toEqual('Verify PIN');
        });

        it('clears the PIN', () => {
          component.pin = '88395';
          component.enter();
          expect(component.pin).toEqual('');
        });
      });

      describe('second call', () => {
        beforeEach(() => {
          component.pin = '88395';
          component.enter();
        });

        describe('when the PINS are equal', () => {
          beforeEach(() => {
            component.pin = '88395';
            component.enter();
          });

          it('dismisses if the dialog', () => {
            const modalController = TestBed.inject(ModalController);
            expect(modalController.dismiss).toHaveBeenCalledTimes(1);
          });

          it('returns the PIN', () => {
            const modalController = TestBed.inject(ModalController);
            expect(modalController.dismiss).toHaveBeenCalledWith('88395');
          });
        });

        describe('when the PINS are not equal', () => {
          beforeEach(() => {
            component.pin = '99206';
            component.enter();
          });

          it('does not close the modal', () => {
            const modalController = TestBed.inject(ModalController);
            expect(modalController.dismiss).not.toHaveBeenCalled();
          });

          it('sets an error message', () => {
            expect(component.errorMessage).toEqual('PINS do not match');
          });

          it('resets the prompt', () => {
            expect(component.prompt).toEqual('Create Session PIN');
          });

          it('sets the PIN to empty', () => {
            expect(component.pin).toEqual('');
          });
        });
      });
    });

    describe('unlock mode', () => {
      beforeEach(() => {
        component.setPasscodeMode = false;
        fixture.detectChanges();
      });

      it('dismisses the dialog', () => {
        const modalController = TestBed.inject(ModalController);
        component.enter();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('passes back the entered PIN', () => {
        const modalController = TestBed.inject(ModalController);
        component.pin = '88395';
        component.enter();
        expect(modalController.dismiss).toHaveBeenCalledWith('88395');
      });
    });
  });
});
