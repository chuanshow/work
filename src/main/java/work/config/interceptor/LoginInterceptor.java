/*package work.config.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import work.entity.po.User;
*//**
 * 
 * @author chuan
 *
 *//*
public class LoginInterceptor implements HandlerInterceptor {
	  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	            throws Exception {
	        User user = (User) request.getSession().getAttribute("user");
	        if (user == null) {
	            response.sendRedirect(request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath() + "/index/login");
	            return false;
	        }
	        return true;
	    }

	    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
	            ModelAndView modelAndView) throws Exception {

	    }

	    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
	            throws Exception {

	    }
}
*/