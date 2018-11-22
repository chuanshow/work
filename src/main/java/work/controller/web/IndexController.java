package work.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
/**
 * 
 * @author chuan
 *
 */
@Controller
public class IndexController {
	@RequestMapping(value={"/hi",""})
	public ModelAndView  hello(){
		ModelAndView model = new ModelAndView("/hello");
		return model;
	}
}
