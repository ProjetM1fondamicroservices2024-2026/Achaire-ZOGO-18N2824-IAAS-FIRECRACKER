-- init.sql
CREATE DATABASE IF NOT EXISTS service_vm_host_db;
CREATE DATABASE IF NOT EXISTS service_cluster_db;
CREATE DATABASE IF NOT EXISTS service_system_image_db;
CREATE DATABASE IF NOT EXISTS service_vm_offer_db;

-- Permissions pour l'utilisateur firecracker
GRANT ALL PRIVILEGES ON service_vm_host_db.* TO 'firecracker'@'%';
GRANT ALL PRIVILEGES ON service_cluster_db.* TO 'firecracker'@'%';
GRANT ALL PRIVILEGES ON service_system_image_db.* TO 'firecracker'@'%';
GRANT ALL PRIVILEGES ON service_vm_offer_db.* TO 'firecracker'@'%';
FLUSH PRIVILEGES;