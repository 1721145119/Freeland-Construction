import i18n from "@client/i18n";

console.log(i18n.t("welcome_game"));
console.log(i18n.t("welcome", { context: "ap" }));
console.log(i18n.t("navigator.language", { language: navigator.language }));
