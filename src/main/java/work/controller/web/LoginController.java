package work.controller.web;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import work.config.definition.UserInfo;
import work.entity.po.User;
import work.service.UserService;

/**
 * 
 * @author chuan
 *
 */
@RestController
public class LoginController extends BaseWeb{
	@Autowired 
	private UserService uSerives;
	
	@RequestMapping(value={"/index/login",""})
	public ModelAndView Login(@UserInfo String username,@UserInfo String password){
		 ModelAndView model =new ModelAndView(); 
		  Subject subject =SecurityUtils.getSubject();
		  try {
			  if(subject.isAuthenticated()){
	            model.setViewName("/index");
	            return model;
			  }else{
				  model.setViewName("/user/loginpage");
		            return model; 
			  }
	        } catch (Exception e) {
	        	model.setViewName("/user/loginpage");
	            return model;
	        }
		
	}
	 @RequestMapping(value={"/user/login"})
	 public ModelAndView login(HttpServletRequest request,String upassword,String uname){
		    Subject subject = SecurityUtils.getSubject();
		    ModelAndView model =new ModelAndView();
		    if(subject.isAuthenticated()){
		 		  model.setViewName("/index");
		          return model;
		 	}
		 	UsernamePasswordToken token = new UsernamePasswordToken(uname, upassword);
	        try {
	        	subject.login(token);//登陆成功的话，放到session中
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
	 public ModelAndView exist(){
		 ModelAndView model =new ModelAndView("/user/loginpage");
		 Subject subject = SecurityUtils.getSubject();
		 subject.logout();
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
	 @GetMapping("/user/login/check")
	 public String totest(String name){
		 return name+"togo";
	 }
}
