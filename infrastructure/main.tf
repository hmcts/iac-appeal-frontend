locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
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

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "8.11.3"
    NODE_ENV                     = "${var.infrastructure_env}"
  }
}
