package com.example.chess.db.repo.mysql.impl;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.AbstractEntity;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Transactional
public abstract class MySqlAbstractRepo<T extends AbstractEntity> implements AbstractRepo<T> {

    protected EntityManager entityManager;

    private final Class<T> clazz;

    public MySqlAbstractRepo(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public void save(T entity) {
        Logger logger = Logger.getLogger(getClass().toString());
        logger.info("Saving entity: " + entity.toString());
        entityManager.persist(entity);
        logger.info("retrieving entity to confirm");
        Optional<T> t = this.findById(entity.getId());
        if (t.isEmpty()) {
            throw new RuntimeException("It wasn't there lol");
        }
        logger.info("it was there");

    }

    @Override
    public void delete(T entity) {
        if (entityManager.contains(entity)) {
            entityManager.remove(entity);
        } else {
            entityManager.remove(entityManager.merge(entity));
        }
    }

    @Override
    public T merge(T entity) {
        return entityManager.merge(entity);
    }

    @Override
    public void deleteById(Object id) {
        var entity = entityManager.find(clazz, id);
        entityManager.remove(entity);
    }

    @Override
    public Optional<T> findById(Object id) {
        String x = "x";
        return Optional.ofNullable(entityManager.find(clazz, id));
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<T> findAll() {
        return (List<T>) entityManager.createQuery("SELECT e FROM " + clazz.getSimpleName() + " e").getResultList();
    }

    // injected from MySqlConfig.java
    @PersistenceContext(unitName = "entityManagerFactory")
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
}
