package work.controller.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
/**
 * 
 * @author chuan
 *
 */
@Controller
@RequestMapping("/web")
public class IndexController {
	@Autowired
    private DiscoveryClient discoveryClient;
	
	@RequestMapping(value={"/hi"})
	public ModelAndView  hello(){
		ModelAndView model = new ModelAndView("/hello");
		return model;
	}
	@RequestMapping(value="getservice")
	public List<String> getService(){
		return discoveryClient.getServices();
	}
	
	
}
