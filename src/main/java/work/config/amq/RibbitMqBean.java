/*package work.config.amq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RibbitMqBean {
	
	交换机name
	@Value("${spring.EXCHANGE_NAME}")
	private String EXCHANGE_NAME;
	
	@Bean
    FanoutExchange fanoutExchange() {
        return new FanoutExchange("EXCHANGE_NAME");
    }
	@Bean(name="AMessage")
    public Queue AMessage() {
        return new Queue("fanout.A");
    }

	@Bean(name="BMessage")
    public Queue BMessage() {
        return new Queue("fanout.B");
    }

    @Bean(name="CMessage")
    public Queue CMessage() {
        return new Queue("fanout.C");
    }
    @Bean
    Binding bindingExchangeA(@Value("AMessage")Queue AMessage, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(AMessage).to(fanoutExchange);
    }

    @Bean
    Binding bindingExchangeB(@Value("BMessage")Queue BMessage, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(BMessage).to(fanoutExchange);
    }

    @Bean
    Binding bindingExchangeC(@Value("CMessage")Queue CMessage, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(CMessage).to(fanoutExchange);
    }
	
}
*/