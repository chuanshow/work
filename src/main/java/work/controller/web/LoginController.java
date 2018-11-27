package work.controller.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import work.entity.po.User;
import work.service.UserService;

/**
 * 
 * @author chuan
 *
 */
@RestController
public class LoginController {
	@Autowired 
	private UserService uSerives;
	
	@RequestMapping(value={"/index/login",""})
	public ModelAndView Login(){
		ModelAndView model = new ModelAndView("/user/loginpage");
		return model;
		
	}
	 @RequestMapping(value={"/user/login"})
	 public ModelAndView login(HttpServletRequest request,String upassword,String uname, HttpSession session){
		 ModelAndView model =new ModelAndView();
		 UsernamePasswordToken token = new UsernamePasswordToken(uname, upassword);
	        Subject subject = SecurityUtils.getSubject();
	        try {
	            subject.login(token);//登陆成功的话，放到session中
	            User user = (User) subject.getPrincipal();
	            session.setAttribute("user", user);
	            model.setViewName("/index");
	            model.addObject("msg","登录成功");
	            return model;
	        } catch (Exception e) {
	        	model.setViewName("/user/loginpage");
	        	 model.addObject("msg","登录失败,请确保输入密码和用户名正确");
	            return model;
	        }
	 }
	 @RequestMapping(value="/exist")
	 public ModelAndView exist(HttpServletRequest request){
		 ModelAndView model=new ModelAndView("/user/loginpage");
		 HttpSession session = request.getSession();
		session.removeAttribute("user");
		return model;
	 }
	 @RequestMapping(value="/regist",method=RequestMethod.POST)
	public ModelAndView register(String upassword,String uname){
		 User user = new User();
		 user.setPassword(upassword);
		 user.setUsername(uname);
		 ModelAndView model=new ModelAndView("/user/loginpage");
		Integer i= uSerives.save(user);
		if(i>0){
			model.addObject("msg", "注册成功,请重新登录");
		}else{
			model.addObject("msg", "账户已经存在,不要重复注册");
		}
		 return model;
	}
	 @RequestMapping(value="/user/regist")
	 public ModelAndView toRegister(){
		 return new ModelAndView("/user/regist");
	 }
}
