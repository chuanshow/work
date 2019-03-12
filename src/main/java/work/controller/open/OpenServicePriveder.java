package work.controller.open;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.net.HostAndPort;
import com.orbitz.consul.Consul;
import com.orbitz.consul.StatusClient;

@RequestMapping(value="/open")
@RestController
public class OpenServicePriveder {
	
	@RequestMapping(value="/test")
	public String test(){
		 Consul consul = Consul.builder().withHostAndPort(HostAndPort.fromString("127.0.0.1:8500")).build(); 
		 StatusClient statusClient =consul.statusClient();
		String leader = statusClient.getLeader();
		 return leader;
	}
}
