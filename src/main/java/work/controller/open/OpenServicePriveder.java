package work.controller.open;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value="/open")
@RestController
public class OpenServicePriveder {
	
	@RequestMapping(value="/test")
	public String test(){
		return "yes";
	}
}
