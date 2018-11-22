package work.controller.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * 
 * @author chuan
 *
 */
@RestController
public class LoginController {
	
	@RequestMapping(value="/index/login")
	public ModelAndView Login(){
		ModelAndView model = new ModelAndView("/user/login");
		return model;
		
	}
}
