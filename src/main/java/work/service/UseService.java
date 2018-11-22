package work.service;

import java.util.List;

import org.springframework.stereotype.Service;

import work.entity.po.User;

@Service
public interface UseService {

	
	public List<User> getAllUser();
	
	public User findUser(String userid);
}
