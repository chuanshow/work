package work.controller.web;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;

@Controller
public class BaseWeb {
	
	@Autowired
	HttpServletResponse response;
	
	protected void sendRedirect(String url) {
		try {
			response.sendRedirect(url);
		} catch (IOException e) {
			run_login();
		}
		return;
	}
	protected void run_login(){
	
		try {
			response.sendRedirect("/user/login");
		} catch (IOException e) {
			e.getMessage();
		}
	}
	public boolean is_login(){
		
	 Subject subject = SecurityUtils.getSubject();
		
	 return subject.isAuthenticated();
	}
	public void run_success(String msg){
		JSONObject obj = new JSONObject();
		obj.put("status", true);
		obj.put("msg", msg);
		printJson(obj.toJSONString());
	}
	public void printJson(String result){
		try {
			setResponseHeader("application/json");
			response.getWriter().print(result);
		} catch (IOException e) {
			
		}
		return;
	}
	
	public void setResponseHeader(String type){
		response.setContentType(type+ ";charset=UTF-8");
	}
}
