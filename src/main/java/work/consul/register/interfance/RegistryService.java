package work.consul.register.interfance;

import org.springframework.cloud.client.ServiceInstance;

public interface RegistryService {
	ServiceInstance GetRegisterService();
}