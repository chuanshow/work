package work.controller.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import work.entity.po.User;
import work.service.UseService;

/**
 * 
 * @author chuan
 *
 */
@RestController
public class LoginController {
	@Autowired 
	private UseService uSerives;
	
	@RequestMapping(value="/index/login")
	public ModelAndView Login(){
		ModelAndView model = new ModelAndView("/user/loginpage");
		return model;
		
	}
	 @RequestMapping(value="/user/login")
	 public ModelAndView login(HttpServletRequest request,String upassword,String uname){
		 HttpSession session = request.getSession();
		User user = new User();
		user.setUserid("123");
		if(user!=null){
			session.setAttribute("user", user);
		}
		 return new ModelAndView("/hello");
	 }
}
