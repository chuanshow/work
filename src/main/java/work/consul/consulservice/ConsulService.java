package work.consul.consulservice;

import java.net.MalformedURLException;
import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.stereotype.Service;

import com.orbitz.consul.AgentClient;
import com.orbitz.consul.Consul;
import com.orbitz.consul.HealthClient;
import com.orbitz.consul.KeyValueClient;
import com.orbitz.consul.StatusClient;
import com.orbitz.consul.model.health.ServiceHealth;

@Service
public class ConsulService {
	
	@Autowired
	private LoadBalancerClient loadBalancerClient;
	/**
	     * 注册服务
     * 并对服务进行健康检查
	      * servicename唯一
	      * serviceId:没发现有什么作用
	      */
	     public void registerService(String serviceName, String serviceId,String url) {
	         Consul consul = Consul.builder().build();            //建立consul实例
	         AgentClient agentClient = consul.agentClient();        //建立AgentClient
	         
	         try {
	            /**
	              * 注意该注册接口：
	              * 需要提供一个健康检查的服务URL，以及每隔多长时间访问一下该服务（这里是3s）
	              */
	             agentClient.register(8080, URI.create(url).toURL(), 3, serviceName, serviceId, "dev");
	         } catch (MalformedURLException e) {
	            e.printStackTrace();
	         }
	    }
	     
	     /**
	      * 发现可用的服务
	      */
	     public List<ServiceHealth> findHealthyService(String servicename){
	         Consul consul = Consul.builder().build();
	         HealthClient healthClient = consul.healthClient();//获取所有健康的服务
	         return healthClient.getHealthyServiceInstances(servicename).getResponse();//寻找passing状态的节点
	     }
	     
	     /**
	      * 存储KV
	      */
	     public void storeKV(String key, String value){
	         Consul consul = Consul.builder().build();
         KeyValueClient kvClient = consul.keyValueClient();
	         kvClient.putValue(key, value);//存储KV
	     }
	     
	     /**
      * 根据key获取value
	      */
	     public String getKV(String key){
	         Consul consul = Consul.builder().build();
	         KeyValueClient kvClient = consul.keyValueClient();
	         return kvClient.getValueAsString(key).get();
	     }
	     
	     /**
	      * 找出一致性的节点（应该是同一个DC中的所有server节点）
	      */
	     public List<String> findRaftPeers(){
	         StatusClient statusClient = Consul.builder().build().statusClient();
	         return statusClient.getPeers();
	     }
	     
	     /**
      * 获取leader
	      */
	     public String findRaftLeader(){
	         StatusClient statusClient = Consul.builder().build().statusClient();
	         return statusClient.getLeader();
     }
	     /**
	      * 随机获取一个服务
	      * @return
	      */
	     public ServiceInstance findoneservice(){
	    	ServiceInstance service = loadBalancerClient.choose("myservice");
	    	return service;
	     }
}
