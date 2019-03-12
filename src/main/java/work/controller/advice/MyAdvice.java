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
	/*系统url*/
	@Value("${domain}")
	private static String Domain;
	/*交换机name*/
	@Value("${spring.EXCHANGE_NAME}")
	private String EXCHANGE_NAME;
	 
		@ModelAttribute(name="domain")
	    public String domian() {
	        return Domain;
	    } 
		
		@ModelAttribute(name="EXCHANGE_NAME")
	    public String EXCHANGE_NAME() {
	        return EXCHANGE_NAME;
	    }
}
