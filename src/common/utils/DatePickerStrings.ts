import { IDatePickerStrings } from "@fluentui/react/lib/DatePicker";

export const DatePickerStrings: IDatePickerStrings = {
	months: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	],

	shortMonths: ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'],

	days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],

	shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],

	goToToday: "Aller à aujourd'hui",
	prevMonthAriaLabel: "Aller au mois précédent",
	nextMonthAriaLabel: "Aller au mois prochain",
	prevYearAriaLabel: "Aller à l'année précédente",
	nextYearAriaLabel: "Aller à l'année prochaine",

	// isRequiredErrorMessage: "Une date est requise.",
	isRequiredErrorMessage: "",
	invalidInputErrorMessage: "Format de date invalide.",
	isOutOfBoundsErrorMessage: `La date ne peut être inférieur à la date de début.`
	// isOutOfBoundsErrorMessage: `La date ne peut être inférieur à ${new Date().toLocaleDateString()}`
};
