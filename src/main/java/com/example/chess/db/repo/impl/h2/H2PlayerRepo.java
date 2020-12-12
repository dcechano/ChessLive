package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository(value = "H2PlayerRepo")
@Transactional(transactionManager = "h2TransactionManager")
public class H2PlayerRepo extends H2AbstractRepoImpl<Player> implements PlayerRepo {

    public H2PlayerRepo() {
        super(Player.class);
    }

}
