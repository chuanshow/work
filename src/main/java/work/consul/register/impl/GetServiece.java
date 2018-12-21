package work.consul.register.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Component;

import work.consul.register.interfance.RegistryService;
/**
 * 获取consul中心服务
 * @author ASUS
 *
 */
@Component
public class GetServiece implements RegistryService{
	
	@Autowired
    private DiscoveryClient discoveryClient;
	@Override
	public ServiceInstance GetRegisterService(){
		List<ServiceInstance> service = discoveryClient.getInstances("myservice");
		return service.get(0);
	}

}
