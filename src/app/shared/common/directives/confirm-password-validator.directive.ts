import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";

@Directive({
  selector: "[appConfirmPasswordValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmPasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class ConfirmPasswordValidatorDirective implements Validator {
  @Input() appConfirmPasswordValidator: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const compareToControl = control.parent.get(
      this.appConfirmPasswordValidator
    );
    if (compareToControl && compareToControl.value !== control.value) {
      return { notEqual: true };
    }
    return null;
  }
}
