package work.controller.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
/**
 * 错误处理
 * @author chuan
 *
 */
@RestController
@RequestMapping("/web")
public class ErrorWeb {

	@RequestMapping("/404")
	public ModelAndView pagenotfund(){
		ModelAndView model= new ModelAndView("/error/404.html");
		return model;
	}
	
	@RequestMapping("/400")
	public ModelAndView notpermission(){
		ModelAndView model= new ModelAndView("/error/400.html");
		return model;
	}
}
