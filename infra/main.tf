# This file defines the infrastructure for our Freqtrade bot on Azure.

# Configure the Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}
provider "azurerm" {
  features {
    resource_group {
       prevent_deletion_if_contains_resources = false
    }
  }
}

# 1. Create a Resource Group to hold all our resources
resource "azurerm_resource_group" "rg" {
  name     = "project-orca-rg"
  location = "UK South" # You can choose a region closer to you
}

# 2. Create a Virtual Network
resource "azurerm_virtual_network" "vnet" {
  name                = "project-orca-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

# 3. Create a Subnet
resource "azurerm_subnet" "subnet" {
  name                 = "project-orca-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# 4. Create a Public IP so we can access the VM
resource "azurerm_public_ip" "pip" {
  name                = "project-orca-pip"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# 5. Create a Network Security Group to act as a firewall
resource "azurerm_network_security_group" "nsg" {
  name                = "project-orca-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

 security_rule {
    name                       = "AllowSSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowFreqUI"
    priority                   = 200
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8080"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# 6. Create a Network Interface
resource "azurerm_network_interface" "nic" {
  name                = "project-orca-nic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

# 7. Connect the NSG to the NIC
resource "azurerm_network_interface_security_group_association" "nsg_assoc" {
  network_interface_id      = azurerm_network_interface.nic.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

variable "admin_public_key" {
  type        = string
  description = "The public SSH key for the admin user (freqtrader)."
  default     = "" # Add a default value to make planning non-interactive.
}

# 8. Create the Virtual Machine
resource "azurerm_linux_virtual_machine" "vm" {
  name                  = "freqtrade-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  size                  = "Standard_B1s" # A cheap, burstable VM perfect for our needs
  admin_username        = "freqtrader"
  network_interface_ids = [azurerm_network_interface.nic.id]

  custom_data = base64encode(file("${path.module}/vm_setup.sh"))
  
  admin_ssh_key {
    username   = "freqtrader"
    public_key = var.admin_public_key # Use the variable instead of a hardcoded file path
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}

# Output the public IP address of the VM after it's created
output "public_ip_address" {
  value = azurerm_public_ip.pip.ip_address
}
