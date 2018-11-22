package work.controller.advice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
/**
 * 
 * @author chuan
 *	全局常量设置
 */
@ControllerAdvice
public class MyAdvice {
	
	@Value("${domain}")
	private String Domain;
	
	 @ModelAttribute(name="domain")
	    public String domian() {
	        return Domain;
	    } 
}
