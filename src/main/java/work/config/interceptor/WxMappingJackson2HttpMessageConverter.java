package work.config.interceptor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

public class WxMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter  {
	 public WxMappingJackson2HttpMessageConverter(){
	        List<MediaType> mediaTypes = new ArrayList<>();
	        mediaTypes.add(MediaType.APPLICATION_JSON_UTF8); 
	        setSupportedMediaTypes(mediaTypes);// tag6
	    }
}
