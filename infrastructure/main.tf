provider "azurerm" {}

resource "azurerm_resource_group" "rg" {
  name     = "${var.product}-${var.component}-${var.env}"
  location = "${var.location}"
  tags     = "${merge(var.common_tags, map("lastUpdated", "${timestamp()}"))}"
}

data "azurerm_key_vault" "ia_key_vault" {
  name                = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "ia_case_api_url" {
  name      = "ia-case-api-url"
  vault_uri = "${data.azurerm_key_vault.ia_key_vault.vault_uri}"
}

locals {
  aseName             = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  previewVaultName    = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName           = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
}

module "ia-apfr" {
  source               = "git@github.com:contino/moj-module-webapp?ref=master"
  product              = "${var.product}-${var.component}"
  location             = "${var.location}"
  env                  = "${var.env}"
  ilbIp                = "${var.ilbIp}"
  is_frontend          = "${var.env != "preview" ? 1: 0}"
  subscription         = "${var.subscription}"
  additional_host_name = "${var.env != "preview" ? var.additional_hostname : "null"}"
  https_only           = "${var.env != "preview" ? "true" : "true"}"
  common_tags          = "${var.common_tags}"
  asp_rg               = "${var.product}-${var.component}-${var.env}"
  asp_name             = "${var.product}-${var.component}-${var.env}"

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "8.11.1"
    NODE_ENV                     = "${var.infrastructure_env}"
    IA_CASE_API_URL              = "${data.azurerm_key_vault_secret.ia_case_api_url.value}"
  }
}
